#!/usr/bin/env python3
"""
Cleanup utility for temporary files and scripts
"""
import os
import sys
import time
from pathlib import Path

def cleanup_temp_files(dry_run=True):
    """Clean up temporary files older than specified days"""
    
    project_root = Path(__file__).parent.parent
    temp_dirs = [
        project_root / "scripts" / "temp",
        project_root / "api" / "scripts" / "temp"
    ]
    
    # Files older than this many days will be cleaned up
    MAX_AGE_DAYS = 30
    cutoff_time = time.time() - (MAX_AGE_DAYS * 24 * 60 * 60)
    
    print("🧹 Temporary File Cleanup Utility")
    print(f"   Removing files older than {MAX_AGE_DAYS} days")
    print(f"   Dry run: {'Yes' if dry_run else 'No'}")
    print()
    
    total_files = 0
    total_size = 0
    cleaned_files = 0
    cleaned_size = 0
    
    for temp_dir in temp_dirs:
        if not temp_dir.exists():
            continue
            
        print(f"📁 Checking directory: {temp_dir}")
        
        # Skip README files
        for file_path in temp_dir.rglob("*"):
            if file_path.is_file() and file_path.name != "README.md":
                total_files += 1
                file_size = file_path.stat().st_size
                total_size += file_size
                
                # Check if file is old enough to clean up
                file_age = file_path.stat().st_mtime
                
                if file_age < cutoff_time:
                    cleaned_files += 1
                    cleaned_size += file_size
                    
                    age_days = (time.time() - file_age) / (24 * 60 * 60)
                    print(f"   🗑️  {'Would delete' if dry_run else 'Deleting'}: {file_path.name} ({age_days:.1f} days old, {file_size:,} bytes)")
                    
                    if not dry_run:
                        try:
                            file_path.unlink()
                        except Exception as e:
                            print(f"      ❌ Error deleting {file_path.name}: {e}")
                else:
                    age_days = (time.time() - file_age) / (24 * 60 * 60)
                    print(f"   📄 Keeping: {file_path.name} ({age_days:.1f} days old)")
    
    print()
    print("📊 Summary:")
    print(f"   Total files found: {total_files}")
    print(f"   Total size: {total_size:,} bytes ({total_size/1024:.1f} KB)")
    print(f"   Files {'to be cleaned' if dry_run else 'cleaned'}: {cleaned_files}")
    print(f"   Size {'to be freed' if dry_run else 'freed'}: {cleaned_size:,} bytes ({cleaned_size/1024:.1f} KB)")
    
    if dry_run and cleaned_files > 0:
        print()
        print("💡 To actually delete these files, run:")
        print("   python scripts/cleanup-temp.py --execute")

def list_temp_files():
    """List all temporary files"""
    
    project_root = Path(__file__).parent.parent
    temp_dirs = [
        project_root / "scripts" / "temp",
        project_root / "api" / "scripts" / "temp"
    ]
    
    print("📋 Current Temporary Files:")
    print()
    
    total_files = 0
    total_size = 0
    
    for temp_dir in temp_dirs:
        if not temp_dir.exists():
            continue
            
        print(f"📁 {temp_dir}:")
        
        files_in_dir = []
        for file_path in temp_dir.rglob("*"):
            if file_path.is_file():
                file_size = file_path.stat().st_size
                file_age = file_path.stat().st_mtime
                age_days = (time.time() - file_age) / (24 * 60 * 60)
                
                files_in_dir.append({
                    'name': file_path.name,
                    'size': file_size,
                    'age_days': age_days,
                    'path': file_path
                })
                
                total_files += 1
                total_size += file_size
        
        # Sort by age (oldest first)
        files_in_dir.sort(key=lambda x: x['age_days'], reverse=True)
        
        for file_info in files_in_dir:
            print(f"   📄 {file_info['name']} ({file_info['age_days']:.1f} days, {file_info['size']:,} bytes)")
        
        if not files_in_dir:
            print("   (empty)")
    
    print()
    print(f"📊 Total: {total_files} files, {total_size:,} bytes ({total_size/1024:.1f} KB)")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == "--execute":
            cleanup_temp_files(dry_run=False)
        elif sys.argv[1] == "--list":
            list_temp_files()
        elif sys.argv[1] == "--help":
            print("🧹 Temporary File Cleanup Utility")
            print()
            print("Usage:")
            print("  python scripts/cleanup-temp.py           # Dry run (show what would be deleted)")
            print("  python scripts/cleanup-temp.py --execute # Actually delete old files")
            print("  python scripts/cleanup-temp.py --list    # List all temporary files")
            print("  python scripts/cleanup-temp.py --help    # Show this help")
        else:
            print("❌ Unknown option. Use --help for usage information.")
    else:
        cleanup_temp_files(dry_run=True)
